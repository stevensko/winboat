Name:           winboat
Version:        0.8.7
Release:        1%{?dist}
Summary:        A desktop application for WinBoat management

License:        MIT
URL:            https://github.com/TibixDev/WinBoat
Source0:        %{name}-%{version}.tar.gz

# FIX: The previous build failed because the required Node.js version was too high.
# The project requires Node.js >= 23.6.0, but the mock environment used v22.19.0.
# We must explicitly request the minimum required version for the package manager to attempt to satisfy it.
BuildRequires:  nodejs >= 23.6.0
BuildRequires:  npm
BuildRequires:  gcc

%description
WinBoat is a utility for managing boat fleet data.

%prep
%setup -q

%build
# Execute npm install. This failed previously due to the wrong Node.js version.
npm install --production=false

# Add the actual build commands here (e.g., npm run build)

%install
# Placeholder for installation commands

%files
# Placeholder for installed files

%changelog
* Wed Oct 8 2025 Stevensko <your@email.com> 0.8.7-1
- Initial automated build with GitHub Actions setup.
- Updated BuildRequires to specify Node.js >= 23.6.0 to resolve build failure.
