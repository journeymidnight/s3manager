Name:      plato-boss-ui	
Version:   %{version}
Release:   %{release}%{?dist}
Summary:   plato boss ui
Group:	   Development/Libraries
License:   MIT
URL:	   http://plato_ui.com
Source0:   %{name}.tar.gz

%description
plato boss ui build package

%prep

%build

%install
mkdir %{buildroot}/usr/local/plato-boss-ui -p
tar xfz  %{SOURCE0} -C %{buildroot}/usr/local/plato-boss-ui

%clean
rm -rf %{buildroot}

%pre

%post

%files
%defattr(-,root,root)
/usr/local/plato-boss-ui

%changelog
