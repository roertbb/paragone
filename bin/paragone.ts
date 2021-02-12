#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { ParagoneStack } from '../lib/paragone-stack';

const app = new cdk.App();
new ParagoneStack(app, 'ParagoneStack');
