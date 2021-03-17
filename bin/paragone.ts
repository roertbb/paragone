#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { ParagoneStack } from "../lib/paragoneStack";
import { ParagoneFrontendStack } from "../lib/ParagoneFrontendStack";

const app = new cdk.App();
new ParagoneStack(app, "ParagoneStack");
new ParagoneFrontendStack(app, "ParagoneFrontendStack");
