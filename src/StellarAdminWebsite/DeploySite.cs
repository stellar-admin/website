using Statiq.Common;
using Statiq.Core;
using Statiq.Web.GitHub;

namespace StellarAdminWebsite
{
    public class DeploySite : Pipeline
    {
        public DeploySite()
        {
            Deployment = true;

            OutputModules = new ModuleList
            {
                new DeployGitHubPages("stellar-admin", "website", Config.FromSetting<string>("GITHUB_TOKEN")).ToBranch("master")
            };
        }
    }}