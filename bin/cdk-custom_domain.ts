import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { AcmStack } from "../lib/AcmStack";
import { CloudFrontStack } from "../lib/CloudFrontStack";

dotenv.config();
const env = {
  account: process.env.ACCOUNT_ID,
  region: process.env.REGION,
};

const app = new cdk.App();

const DemoCertifcate = new AcmStack(app, "acm", {
  env: { account: env.account, region: "us-east-1" }, //acm certs for Edge endpoints like cloudFront can only use certs for om us-east-1
  crossRegionReferences: true, //needs this to be true so stacks in other regions can access the cert
  domain: "www.example.com", //The subdomain you want to create a cert for, can contain wildcard eg: "*.example.com"
  hostedZoneDomain: "example.com", //The domain or subdomain you have registerd in route53
});

new CloudFrontStack(app, "cloudFront", {
  env: env,
  crossRegionReferences: true, //needs this to be true so stacks in other regions can access the cert
  domains: ["www.demo.stst.app"], //Array of domains you want to use for your CloudFront
  certifcate: DemoCertifcate.certificate, //The certificate, can only have one per CloudFront
  hostedZoneDomain: "demo.stst.app", //The domain or subdomain you have registerd in route53
});
