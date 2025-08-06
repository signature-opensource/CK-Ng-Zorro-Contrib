using CK.Core;
using Microsoft.Extensions.Hosting.WindowsServices;
using System.Reflection;

var isService = WindowsServiceHelpers.IsWindowsService();

var webApplicationOptions = new WebApplicationOptions
{
    Args = args,
    ContentRootPath = isService ? AppContext.BaseDirectory : default
};

var builder = WebApplication.CreateBuilder( webApplicationOptions );
var monitor = builder.GetBuilderMonitor();
if( isService )
{
    monitor.Info( $"Running as Windows Service." );
    builder.Host.UseWindowsService();
    var identity = System.Security.Principal.WindowsIdentity.GetCurrent();
    monitor.Info( $"Windows Identity: {identity.Name}" );
}
monitor.Info( $"ContentRootPath: {builder.Environment.ContentRootPath}" );

builder.Services.AddSpaStaticFiles( c =>
{
    c.RootPath = "wwwroot";
} );

builder.UseCKMonitoring();
builder.AddApplicationIdentityServiceConfiguration();

#region Locales configuration
var localePath = Path.Combine( builder.Environment.ContentRootPath, "locales" );
monitor.Info( $"Setting Locale translation files path to: {localePath}." );
GlobalizationFileHelper.SetLocaleTranslationFiles( monitor, localePath );
monitor.Info( "Globalization files should have been loaded." );
#endregion

builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddHttpClient();

var map = StObjContextRoot.Load( Assembly.GetExecutingAssembly(), builder.GetBuilderMonitor() );
var app = builder.CKBuild( map );

// Configure the HTTP request pipeline.
if( !app.Environment.IsDevelopment() )
{
    app.UseExceptionHandler( "/Error" );
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseForwardedHeaders();
app.UseCors( c =>
        c.SetIsOriginAllowed( host => true )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials() );
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
//app.UseCris();

app.UseSpa( ( b ) =>
{
    if( builder.Environment.IsDevelopment() )
    {
        // Note that the proxy will spaz out for 2-3 seconds when using "localhost" instead of "127.0.0.1",
        // as it attempts to connect on IPv6 to [::1]:4200 instead of 127.0.0.1:4200,
        // and SPAs like ng serve usually don't listen on IPv6.
        // See: https://github.com/dotnet/aspnetcore/issues/18062
        b.UseProxyToSpaDevelopmentServer( "http://localhost:4201" );
    }
} );

await app.RunAsync();
