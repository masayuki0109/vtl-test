import * as cdk from "aws-cdk-lib";
import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { AmplifyDependentResourcesAttributes } from "../../types/amplify-dependent-resources-ref";
import { Construct } from "constructs";
import { CfnDataSource } from "aws-cdk-lib/aws-appsync";
import path from "path";

const requestVTL = appsync.MappingTemplate.fromFile(path.join(__dirname, "..", "Query.testColin.req.vtl")).renderTemplate()
const responseVTL = appsync.MappingTemplate.fromFile(path.join(__dirname, "..", "Query.testColin.res.vtl")).renderTemplate()

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });

    // Access other Amplify Resources
    const retVal: AmplifyDependentResourcesAttributes =
      AmplifyHelpers.addResourceDependency(
        this,
        amplifyResourceProps.category,
        amplifyResourceProps.resourceName,
        [
          {
            category: "api",
            resourceName: "amplifynext",
          },
        ]
      );

    const resolver = new appsync.CfnResolver(this, "custom-resolver", {
      // apiId: retVal.api.new.GraphQLAPIIdOutput,
      // https://github.com/aws-amplify/amplify-cli/issues/9391#event-5843293887
      // If you use Amplify you can access the parameter via Ref since it's a CDK parameter passed from the root stack.
      // Previously the ApiId is the variable Name which is wrong , it should be variable value as below
      apiId: cdk.Fn.ref(retVal.api.amplifynext.GraphQLAPIIdOutput),
      fieldName: "testMutation",
      typeName: "Mutation", // Query | Mutation | Subscription
      requestMappingTemplate: requestVTL,
      responseMappingTemplate: responseVTL,
      dataSourceName: "TodoTable", // DataSource name
    });
  }
}
