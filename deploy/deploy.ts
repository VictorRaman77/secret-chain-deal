import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy FHECounter contract
  const deployedFHECounter = await deploy("FHECounter", {
    from: deployer,
    log: true,
  });
  console.log(`FHECounter contract: `, deployedFHECounter.address);

  // Deploy SecretDeal contract
  const deployedSecretDeal = await deploy("SecretDeal", {
    from: deployer,
    log: true,
  });
  console.log(`SecretDeal contract: `, deployedSecretDeal.address);
};

export default func;
func.id = "deploy_contracts"; // id required to prevent reexecution
func.tags = ["FHECounter", "SecretDeal"];
