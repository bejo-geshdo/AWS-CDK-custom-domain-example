import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface AcmStackProps extends cdk.StackProps {
  domains?: string[];
  certifcate?: acm.Certificate;
  hostedZoneDomain?: string;
}

export class CloudFrontStack extends cdk.Stack {
  public readonly certificate: acm.Certificate;
  constructor(scope: Construct, id: string, props: AcmStackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "websiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const cf = new cloudfront.Distribution(this, "cf", {
      defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
      defaultRootObject: "index.html",
      certificate: props.certifcate,
      domainNames: props.domains,
    });

    if (props.domains && props.hostedZoneDomain) {
      const zone = route53.HostedZone.fromLookup(this, "zone", {
        domainName: props.hostedZoneDomain,
      });

      props.domains?.forEach((domain) => {
        new route53.CnameRecord(this, "domain", {
          recordName: domain,
          zone,
          domainName: cf.distributionDomainName,
        });
      });
    }
  }
}
