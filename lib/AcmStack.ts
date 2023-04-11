import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface AcmStackProps extends cdk.StackProps {
  domain: string;
  hostedZoneDomain: string;
}

export class AcmStack extends cdk.Stack {
  public readonly certificate: acm.Certificate;
  constructor(scope: Construct, id: string, props: AcmStackProps) {
    super(scope, id, props);

    const zone = HostedZone.fromLookup(this, "zone", {
      domainName: props.hostedZoneDomain,
    });

    this.certificate = new acm.Certificate(this, "cert", {
      domainName: props.domain,
      validation: acm.CertificateValidation.fromDns(zone),
    });
  }
}
