Name:           winboat
Version:        __VERSION__
Release:        1%{?dist}
Summary:        A tool for managing or monitoring a specific device type (Placeholder)
License:        MIT
URL:            https://www.google.com/search?q=https://github.com/YourGitHubUser/winboat
Source0:        %{name}-%{version}.tar.gz

BuildRequires:  nodejs
BuildRequires:  npm
BuildRequires:  make
BuildRequires:  git

Requires:       bash

%description
This application provides utility functions for managing and interacting
with winboat hardware. It includes an up-to-date USB device ID list
for accurate detection.

%prep
%setup -q

%build
npm install --production=false

If your project uses a 'build' script in package.json, uncomment this line:
npm run build
%install

Create directories using standard RPM macros (FIXED SYNTAX)
mkdir -p %{buildroot}%{_bindir}
mkdir -p %{buildroot}%{_datadir}/%{name}
cp -a bin/winboat %{buildroot}%{_bindir}/%{name}
cp -a data/usb.ids %{buildroot}%{_datadir}/%{name}/usb.ids

%files
%doc README.md LICENSE
%{_bindir}/%{name}
%{_datadir}/%{name}/usb.ids

%changelog
* Tue Oct 8 2025 Stevensko <your@email.com> 0.8.7-1
- Initial automated build with GitHub Actions setup.
