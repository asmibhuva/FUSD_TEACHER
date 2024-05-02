# Installation
## Install Serverless framework
Next, install the Serverless Framework via npm which was already installed when you installed Node.js.
Open up a terminal and type npm install -g serverless to install Serverless.

```
npm install -g serverless

```
Once the installation process is done you can verify that Serverless is installed successfully by running the following command in your terminal:

```
serverless

```

To see which version of serverless you have installed run:

```
serverless --version

```

https://www.serverless.com/framework/docs/providers/aws/guide/installation#installing-the-serverless-framework

## Setup with the aws-cli

Set up aws-cli with below
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

then run aws configure to configure the aws-cli and credentials:

```
$ aws configure
AWS Access Key ID [None]: AKIAXXXXXXXXXXXXXXXX
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7XXXXXXXXXXXXXXXXXXX
Default region name [None]: us-east-2
Default output format [None]: ENTER

```

# Requirements Before Deployment

1). Create config file

## Create Config file

Copy the `sample.config.json` file and create the `config.<stage>.json` file and set the correct values.

# Steps to Deploy

Once aws credentials are configured, and serverless cli is installed, stack can be deployed with following command.

```
serverless deploy --stage <STAGE-NAME> --aws-profile <YOUR-PROFILE>

```

*make sure:
The stage name and the configuartion file must need to match with each other, 
for an example - deploying dev stage will require config.dev.json.

Value for the parameter --aws-profile is available at ~/.aws/credentials

For default profile this parameter can be skipped.

Deployment progress and deployed stack is available at CloudFormation.

## Resources that created with Deployment
- S3 Bucket
- CloudFront Distribution
- CodeBuild
- CodePipeline
- IAM Role for CodeBuild and CodePipeline

Once you deploy nStack you can see above resources deployed via CloudFormation stack.

# Requirements After Deployment
- Goto CloudFront and copy Cloudfront distribution ID.
- Goto IAM role and add CloudFront distribution access.
- Goto CodeBuild > Edit > Buildspec > replace following line.
  
```
- aws cloudfront create-invalidation --distribution-id {{!Ref CloudFrontDistro}} --paths '/*'

To Replace and paste CloudFront Distribution ID

- aws cloudfront create-invalidation --distribution-id <CloudFront Distribution ID> --paths '/*'


```
Once Stack has been deployed follow above stapes. 

## CICD Pipeline 
- With the new deployment CICD Pipeline should created with CloudFormation stack. When developer push new changes to CodeCommit repository Pipeline should be run automatically.

### Everytime pipeline run it will perform following operation:
- Pull new changes from CodeCommit repository
- Generate build with new changes
- Remove Old build from S3 bucket
- Sync New build on S3 bucket.