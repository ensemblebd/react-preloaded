@echo off
set build_dir=.\lib
set webpack=.\node_modules\.bin\webpack
set babel=.\node_modules\.bin\babel

echo "Building react-preloaded"
rmdir %build_dir% /s /q

echo "Transpile modules"
%babel% ./modules -d %build_dir%

echo "Create dist version for script tags"
%webpack%
