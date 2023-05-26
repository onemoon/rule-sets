import { emptyDir } from 'fs-extra';
import gulp from 'gulp';

const { src, dest } = gulp;

export function clean() {
  return emptyDir('dist');
}

export function build() {
  return src('src/black-list/**/*.yaml').pipe(dest('dist/rule-providers'));
}
