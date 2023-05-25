import gulp from 'gulp';
import { build as buildSets, clean } from './scripts/build.js';

const { task, series } = gulp;

task('build', series(clean, buildSets));
