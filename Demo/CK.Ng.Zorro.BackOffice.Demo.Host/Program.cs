using CK.Core;
using Microsoft.Extensions.Hosting.WindowsServices;
using System.Reflection;

var isService = WindowsServiceHelpers.IsWindowsService();

// The host is a Generic Host: its web server is the "HttpEndpoint" feature of its party (CK.AppIdentity.HttpEndpoint),
// the "Main" endpoint of the "CK-AppIdentity:Local:HttpEndpoint" section (see appsettings.json).
var builder = Host.CreateApplicationBuilder( new HostApplicationBuilderSettings
{
    Args = args,
    ContentRootPath = isService ? AppContext.BaseDirectory : default
} );
var monitor = builder.GetBuilderMonitor();
if( isService )
{
    monitor.Info( $"Running as Windows Service." );
    builder.Services.AddWindowsService();
    var identity = System.Security.Principal.WindowsIdentity.GetCurrent();
    monitor.Info( $"Windows Identity: {identity.Name}" );
}
monitor.Info( $"ContentRootPath: {builder.Environment.ContentRootPath}" );

builder.UseCKMonitoring();
builder.AddApplicationIdentityServiceConfiguration();
// The monitor of the work outside the requests (the requests have the one of their ScopedHttpContext).
builder.Services.AddScoped<IActivityMonitor, ActivityMonitor>();
builder.Services.AddScoped( sp => sp.GetRequiredService<IActivityMonitor>().ParallelLogger );

#region Locales configuration
var localePath = Path.Combine( builder.Environment.ContentRootPath, "locales" );
monitor.Info( $"Setting Locale translation files path to: {localePath}." );
GlobalizationFileHelper.SetLocaleTranslationFiles( monitor, localePath );
monitor.Info( "Globalization files should have been loaded." );
#endregion

// The web application of each endpoint is configured by the packages: this application is its own AuthCenter (its
// "Local" allows the "AuthCenter" feature) and its HTTP front (the session commands on "/.cris/auth", the other commands
// on "/.cris"), and it serves its client application (Clients/App, see the CKSetup.xml of the Builder). In Development,
// the client application is served by its dev server ("ng serve", started by the host).
var map = StObjContextRoot.Load( Assembly.GetExecutingAssembly(), monitor )
          ?? throw new InvalidOperationException( "Unable to load the generated code: build the Demo.Builder." );
builder.Services.AddStObjMap( monitor, map );

var host = builder.CKBuild();
await host.RunAsync();
