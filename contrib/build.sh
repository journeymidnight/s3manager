#!/bin/bash
set -e -x

package_name=plato-boss-ui

echo 'prepare...'
rpmbuild_dir=/root/rpmbuild
ln -s `pwd`/contrib $rpmbuild_dir

pip install pbr
version=`python setup.py --version | tail -n1`
release=1
spec=$package_name.spec
sed -i "2i\%define version ${version}\n%define release ${release}" contrib/SPECS/$spec

echo 'rpmbuild...'
npm run build
cd dist
tar -zcvf ../contrib/SOURCES/plato-boss-ui.tar.gz .
cd ../

yum-builddep -y contrib/SPECS/$spec
rpmbuild -ba contrib/SPECS/$spec --define "dist .el7"

echo 'uploading...'
wget http://10.11.144.11:8080/upload.py
for filename in `find ./ -name *.rpm`
do
    if [[ "$version" =~ "dev" ]]; then
        python upload.py -f $filename -r plato-development
    else
        python upload.py -f $filename -r plato
    fi
done
