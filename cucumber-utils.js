var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};

const testCaseRunner = require('@cucumber/cucumber/lib/runtime/test_case_runner');
const messages = __importStar(require("@cucumber/messages"));
const messages_1 = require("@cucumber/messages");
const helpers_1 = require("@cucumber/cucumber/lib/runtime/helpers");

/**
 * only step definitions from that current file will be marked as soft assert
 * any fails in other step definitions will stop test scenario execution
 */
const stepDefinitionFilesToMarkAsSoftAssert = [
  'verification-step-definitions.js',
  'api-verification-step-definitions.js',
  'screenshot-step-definitions'];

/**
* Private function that is updating basic cucumber function runStep()
* by adding verification that soft asserts is enabled for that Scenario and
* all assertions in steps from the @stepDefinitionFilesToMarkAsSoftAssert will be used as soft asserts
*/
const _testStepRunner = function () {
  testCaseRunner.default.prototype.runStep = async function (pickleStep, testStep) {
    const stepDefinitions = testStep.stepDefinitionIds.map((stepDefinitionId) => {
      return findStepDefinition(stepDefinitionId, this.supportCodeLibrary);
    });

    if (stepDefinitions.length === 0) {
      return {
        status: messages.TestStepResultStatus.UNDEFINED,
        duration: messages.TimeConversion.millisecondsToDuration(0),
        willBeRetried: false,
      };
    }
    else if (stepDefinitions.length > 1) {
      return {
        message: helpers_1.getAmbiguousStepException(stepDefinitions),
        status: messages.TestStepResultStatus.AMBIGUOUS,
        duration: messages.TimeConversion.millisecondsToDuration(0),
        willBeRetried: false,
      };
    }
    else if (this.isSkippingSteps()) {
      return {
        status: messages.TestStepResultStatus.SKIPPED,
        duration: messages.TimeConversion.millisecondsToDuration(0),
        willBeRetried: false,
      };
    }
    // Custom: Adding step URI to the world. Should be used in aroundTestStep 
    this.world.stepPath = stepDefinitions[0].uri;
    // -----------------------------------------------------------------------
    let stepResult;
    let stepResults = await this.runStepHooks(this.getBeforeStepHookDefinitions());
    if (messages_1.getWorstTestStepResult(stepResults).status !==
      messages.TestStepResultStatus.FAILED) {
      stepResult = await this.invokeStep(pickleStep, stepDefinitions[0]);
      stepResults.push(stepResult);
    }
    const afterStepHookResults = await this.runStepHooks(this.getAfterStepHookDefinitions(), stepResult);
    stepResults = stepResults.concat(afterStepHookResults);
    const finalStepResult = messages_1.getWorstTestStepResult(stepResults);
    let finalDuration = messages.TimeConversion.millisecondsToDuration(0);
    for (const result of stepResults) {
      finalDuration = messages.TimeConversion.addDurations(finalDuration, result.duration);
    }
    finalStepResult.duration = finalDuration;
    return finalStepResult;
  }

};

/**
 * Private function that is updating basic cucumber function isSkippingSteps()
 * if soft assert is enabled - it will go further even when some verification step is falling
 */
const _skipTestFunc = function () {
  testCaseRunner.default.prototype.isSkippingSteps = function isSkippingSteps() {
    if (this.getWorstStepResult().status === messages.TestStepResultStatus.FAILED && _isVerificationStep(this.world.stepPath)) {
      return this.world.enabledSoftAsserts ? !this.world.enabledSoftAsserts : true;
    }

    return (this.getWorstStepResult().status !== messages.TestStepResultStatus.PASSED);
  };
};

const cucumberSoftAssertEnabling = function () {
  _testStepRunner();
  _skipTestFunc();

};
function findStepDefinition(id, supportCodeLibrary) {
  return supportCodeLibrary.stepDefinitions.find((definition) => definition.id === id);
}

function _isVerificationStep(stepPath) {
  return stepDefinitionFilesToMarkAsSoftAssert.some(stepDefinitionFileName => stepPath.includes(stepDefinitionFileName))
}
module.exports = {
  cucumberSoftAssertEnabling
};