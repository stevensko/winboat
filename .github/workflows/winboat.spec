WINBOAT RPM SPECIFICATION FILE
This file defines how the 'winboat' source code is packaged into an RPM.
NOTE: The GitHub Action pipeline automatically creates the source tarball
named 'winboat-%{version}.tar.gz' for use by this spec file.
--- Metadata ---
Name:           winboat
Version:        0.0.1
Release:        1%{?dist}
Summary:        A tool for managing or monitoring a specific device type (Placeholder)

License:        MIT  # Assuming MIT; change as needed
URL:            https://www.google.com/search?q=https://github.com/YourGitHubUser/winboat # Use standard project URL
Source0:        %{name}-%{version}.tar.gz

--- Build Dependencies ---
Node.js and npm are typically required for building modern JS applications.
BuildRequires:  nodejs
BuildRequires:  npm
BuildRequires:  make # Utility for running build commands
BuildRequires:  git

--- General Dependencies (Required at runtime) ---
Add any libraries or packages your final compiled application needs to run.
Requires:       bash

Example: Requires: electron # if this is a desktop app
Example: Requires: libusb-devel # if it links against libusb
%description
This application provides utility functions for managing and interacting
with winboat hardware. It includes an up-to-date USB device ID list
for accurate detection.

--- Preparation Stage ---
%prep

Sets up the source tree by extracting the Source0 tarball.
The tarball contains the source code in a directory named winboat-X.X.X.
%setup -q

--- Build Stage ---
%build

This is where you run compilation or build steps.
For a Node.js project, this often means installing dependencies and running the build script.
echo "Installing Node.js dependencies..."
npm install --production=false

echo "Running custom build commands (e.g., webpack, tsc, etc.)..."

If your project uses a 'build' script in package.json, run it here:
npm run build
If there are no specific build steps, this section can be simple.
--- Install Stage ---
%install

Creates the final directory structure and copies files into %{buildroot}.
Create the final destination directory structure
mkdir -p %{buildroot}%{_bindir}
mkdir -p %{buildroot}%{_datadir}/%{name}

Copy the final compiled application executable or main script
Assuming the main entry point is a script that needs to be executable:
cp -a bin/winboat %{buildroot}%{_bindir}/%{name}

Copy auxiliary data files, ensuring the data/usb.ids is included
cp -a data/usb.ids %{buildroot}%{_datadir}/%{name}/usb.ids

--- Files List ---
%files
%doc README.md LICENSE

Ensure the executable file is correctly listed and has executable permissions
%{_bindir}/%{name}

Ensure the necessary data file is included
%{_datadir}/%{name}/usb.ids

--- Changelog ---
%changelog

Wed Oct 08 2025 Gemini AI gemini@google.com - 0.0.1-1

Initial SRPM generation for GitHub Actions.
