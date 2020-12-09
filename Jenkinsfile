@Library('MesSharedLibrary@master')
import aws.dvsa.mes.Globals
import aws.dvsa.mes.CommonFunctions
import aws.dvsa.mes.GitFunctions
import aws.dvsa.mes.MobileFunctions
import aws.dvsa.mes.NVMFunctions
//------------------------------------------
def Globals         = new Globals()
def CommonFunctions = new CommonFunctions()
def GitFunctions    = new GitFunctions()
def MobileFunctions = new MobileFunctions()
def NVMFunctions    = new NVMFunctions()

String branch_name          = "${env.BRANCH_NAME}"
String ionic_app_id         = Globals.MOBILE_APP_ID
String nodejs_installation  = Globals.MOBILE_NODE_JS
String mobile_config_branch = "master"
//----------------------------------------------------
node (Globals.NONPROD_BUILDER_TAG) {
  currentBuild.description = "BRANCH: ${branch_name}"
  // clear workspace
  deleteDir()
  // declare workspace
  env.WSPACE = pwd()
  // wrappers
  timestamps {
  ansiColor("xterm") {
  wrap([$class: "BuildUser"]) {
    stage("checkout") {
      CommonFunctions.log("info", "STAGE: Checkout")
      GitFunctions.git_check_out(Globals.MOBILE_REPO, branch_name, Globals.MOBILE_NAME, Globals.GITHUB_MOBILE_CREDS, false, false)
    }
    stage("install dependencies") {
      CommonFunctions.log("info", "STAGE: Install Dependencies")
      dir(Globals.MOBILE_NAME) {
        NVMFunctions.run(" -c 'npm install'")
      }
    }
    stage("tests") {
      CommonFunctions.log("info", "STAGE: Tests")
      dir(Globals.MOBILE_NAME) {
        NVMFunctions.run(" -c 'npm test'")
      }
    }
    stage("build") {
      if(branch_name == "develop" || branch_name == "origin/develop"){
          CommonFunctions.log("info", "STAGE: Build")
          // install ionic
          MobileFunctions.ionic_cli_install(nodejs_installation)
          // get current commit hash of the ios_app branch
          String commit_hash = GitFunctions.git_get_commit_hash(Globals.MOBILE_NAME)
          // build
          dir(Globals.MOBILE_NAME) {
            MobileFunctions.ionic_pro_push(nodejs_installation, Globals.MOBILE_DEPLOYER_KEY, branch_name, commit_hash, ionic_app_id)
          }
          CommonFunctions.log("info", "It takes a couple of minutes to build and publish the app to the IonicPro service.")
        }


        // IONIC APP info for Ionic View
        CommonFunctions.shout(ionic_app_id, "35m", Globals.MOBILE_NAME.toUpperCase()+" ID", 26)
  }}}} //ansiColor //BuildUser //timestamps
  // clear workspace
  deleteDir()
}
