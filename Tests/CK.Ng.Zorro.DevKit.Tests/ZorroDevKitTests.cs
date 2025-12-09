using System;
using System.Threading.Tasks;
using CK.Core;
using CK.Testing;
using NUnit.Framework;
using static CK.Testing.MonitorTestHelper;

namespace CK.Ng.Zorro.DevKit.Tests;

public class ZorroDevKitTests
{
    [Test]
    public async Task CK_Ng_Zorro_DevKit_Async()
    {
        var targetProjectPath = TestHelper.GetTypeScriptInlineTargetProjectPath();

        var configuration = TestHelper.CreateDefaultEngineConfiguration();
        configuration.FirstBinPath.Path = TestHelper.BinFolder;

        Type[] tsTypesToGenerate = [];
        var tsConfig = configuration.FirstBinPath.EnsureTypeScriptConfigurationAspect( targetProjectPath, tsTypesToGenerate );
        tsConfig.DefaultCulture = NormalizedCultureInfo.EnsureNormalizedCultureInfo( "fr" );
        await configuration.RunSuccessfullyAsync();
        await using var runner = TestHelper.CreateTypeScriptRunner( targetProjectPath );
        await TestHelper.SuspendAsync( resume => resume );
        runner.Run();
    }
}
