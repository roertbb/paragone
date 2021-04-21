#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { ParagoneStack } from "../lib/paragoneBackendStack";
import { ParagoneFrontendStack } from "../lib/paragoneFrontendStack";

const app = new cdk.App();
new ParagoneStack(app, "ParagoneStack");
new ParagoneFrontendStack(app, "ParagoneFrontendStack");
