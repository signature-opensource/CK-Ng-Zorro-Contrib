<!-- Generated from CK.Ng.Zorro.BackOffice.Demo.Builder/ckonf.json: do not edit. -->
# The App 'CK.Ng.Zorro.BackOffice.$Demo'

Its run time configuration is `appsettings.json`; this document describes it from its content and its compile time choices.

## The projects

- The App: `../CK.Ng.Zorro.BackOffice.Demo.App`
- The Builder: `../CK.Ng.Zorro.BackOffice.Demo.Builder`

## The type set

The types of the packages of the App project (discovered from its folder).

## The configurable types by package

| Package | Configurable types |
|---|---|
| CK.AppIdentity | DevRunningStatus |
| CK.AppIdentity.AuthCenter.Local | AuthCenter |
| CK.AppIdentity.AuthCenter.Password | Password |
| CK.AppIdentity.AuthCenter.Remote | AuthCenterRemote |
| CK.AppIdentity.Cris | CrisChannel |
| CK.AppIdentity.HttpEndpoint | ForwardedHeaders, HttpEndpoint |
| CK.AppIdentity.KeyManagement | KeyManagement |
| CK.AppIdentity.PartyClient | PartyClient |
| CK.AppIdentity.TransportLayer | Transport |
| CK.SqlServer.Setup.Model | SqlServer |
| CK.TS.Angular | NgApp |
| CK.TS.AspNet.Clients | Hosting, StaticFiles |

## The aspects

### AppContext aspect `SqlServer`

Package: `CK.SqlServer.Setup.Model`

| Key | Value |
|---|---|
| DefaultDatabaseConnectionString | *(secret)* |
| Databases | *(contains secrets)* *(default)* |
| GlobalResolution | `false` *(default)* |
| IgnoreMissingDependencyIsError | `false` *(default)* |

## The party '$Host'

- Full name: `Demo/$Host/#Dev`

### Feature `AuthCenter`

Package: `CK.AppIdentity.AuthCenter.Local`

### Feature `HttpEndpoint`

Package: `CK.AppIdentity.HttpEndpoint`

### Feature `PartyClient`

Package: `CK.AppIdentity.PartyClient`

## The client 'App' of '$Host'


### Client feature `NgApp`

Package: `CK.TS.Angular`

Build time:

| Key | Value |
|---|---|
| RequestPath | `/` |
| DevServerPort | `4201` |
| TargetProjectPath | *(none)* *(default)* |
| DefaultTypeScriptVersion | *(none)* *(default)* |
| IntegrationMode | `Inline` |
| InstallYarn | *(none)* *(default)* |
| GitIgnoreCKGenFolder | *(none)* *(default)* |
| AutoInstallJest | *(none)* *(default)* |
| EnableTSProjectReferences | *(none)* *(default)* |
| DefaultCulture | *(none)* *(default)* |
| ActiveCultures | `fr` |
| TypeFilterName | *(none)* *(default)* |
| Barrels | *(none)* *(default)* |
| Types | *(none)* *(default)* |

### Client feature `Hosting`

Package: `CK.TS.AspNet.Clients`
