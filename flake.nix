{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    # devenv.inputs.nixpkgs.follows = "nixpkgs";
    sync-pm.url = "github:Oak-Digital/devenv-sync-pm";
    deploy-rs.url = "github:serokell/deploy-rs";
    deploy-rs.inputs.nixpkgs.follows = "nixpkgs";
    ip-whitelist.url = "github:Oak-Digital/nixos-ip-whitelist-firewall";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, sync-pm, systems, deploy-rs, ip-whitelist, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          devenv-up = self.devShells.${system}.default.config.procfileScript;
          do-image =
            let
              config = {
                imports = [ "${nixpkgs}/nixos/modules/virtualisation/digital-ocean-image.nix" ];
              };
            in
            (pkgs.nixos config).digitalOceanImage;
        });

      devShells = forEachSystem
        (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
            packageManager = pkgs.nodePackages.npm;
            node = pkgs.nodejs_20;
          in
          {
            default =
              devenv.lib.mkShell {
                inherit inputs pkgs;
                modules = [
                  # (sync-pm.lib.devenv-sync-pm-module {
                  #   inherit pkgs packageManager;
                  # })
                  {
                    packages = with pkgs; [
                      sqlcmd
                      packageManager
                      node
                    ];

                    processes =
                      let
                        mssqlServerImage = "mcr.microsoft.com/mssql/server:2022-latest";
                      in
                      {
                        mssql-server-pull = {
                          exec = "docker pull ${mssqlServerImage}";
                        };

                        mssql-server =
                          let
                            stateDir = "$DEVENV_STATE/mssql";
                          in
                          {
                            exec = ''
                              docker run \
                                --hostname bountysql \
                                -i --init --rm \
                                -p 1433:1433 \
                                -e "ACCEPT_EULA=Y" \
                                -e "MSSQL_SA_PASSWORD=SuperSecret1" \
                                -v bountysqlvolume:/var/opt/mssql \
                                ${mssqlServerImage}
                            '';
                            process-compose = {
                              depends_on = {
                                mssql-server-pull = {
                                  condition = "process_completed_successfully";
                                };
                              };
                            };
                          };
                      };

                    services = {
                      postgres = {
                        enable = true;
                        listen_addresses = "0.0.0.0";
                        initialScript = ''
                          CREATE USER postgres SUPERUSER;
                        '';
                        initialDatabases = [
                          {
                            name = "medusa-dev";
                          }
                        ];
                      };

                      redis = {
                        enable = true;
                      };
                    };
                  }
                ];
              };
          });

      nixosConfigurations = {
        sql-server = nixpkgs.lib.nixosSystem {
          system = "x86_64-linux";
          modules = [
            ./infra/sql-server/nixos/configuration.nix
            ip-whitelist.nixosModules.default
          ];
        };
      };

      deploy.nodes = {
        sql-server = {
          hostname = "165.232.114.137";
          profiles.system = {
            user = "root";
            sshUser = "root";
            path = deploy-rs.lib.x86_64-linux.activate.nixos self.nixosConfigurations.sql-server;
          };
        };
      };
    };
}
