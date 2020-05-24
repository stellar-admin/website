order: 8
---

## Introduction

StellarAdmin does not support any specific authorization extension points, but, since it is just a regular ASP.NET Core Razor Page and API Controllers, you can prevent access by making use of ASP.NET Core's built-in authorization features.

## Preventing access to StellarAdmin

Preventing access to StellarAdmin consists of two parts. First, you need to prevent access to the _Admin User Interface (UI)_ and secondly, you need to prevent access to the _API controllers_.

The Admin UI is a [Vue](https://vuejs.org/) application that is served by a single Razor Page to which access can be restricted by making use or Razor Pages [authorization conventions](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/razor-pages-authorization?view=aspnetcore-3.1).

The Admin UI communicates with the StellarAdmin backend via a set of API controllers. Access to these controllers can be restricted by creating a custom [Authorization Filter](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters).

### Preventing access to the Admin UI

The name of the Razor Page that is serving the Admin UI is `/StellarAdmin`. You can require authorization to view this page by adding the `AuthorizePage()` convention.

```cs
public void ConfigureServices(IServiceCollection services)
{
    // ...

    services.AddRazorPages(o =>
    {
        o.Conventions.AuthorizePage("/StellarAdmin");
    });
    services.AddStellarAdmin();
}
```

The example above only requires that a user is authenticated, but you may have more specific requirements. You may, for example, require that a user is an administrator. The `AuthorizePage()` convention takes an optional `policy` parameter, allowing you to specify an [authorization policy](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-3.1) that determines whether the user has permission to view the page.

Let's assume that you determine whether a user is an administrator based on whether they are assigned to the **Administrator** role. In this case, you can create an **IsAdministrator** policy and pass that as the `policy` parameter when calling `AuthorizePage()`.

```cs
public void ConfigureServices(IServiceCollection services)
{
    // ...

    services.AddAuthorization(o =>
    {
        o.AddPolicy("IsAdministrator", builder => builder.RequireRole("Administrator"));
    });
    services.AddRazorPages(o =>
    {
        o.Conventions.AuthorizePage("/StellarAdmin", "IsAdministrator");
    });
    services.AddStellarAdmin();
}
```

### Preventing access to the API

The StellarAdmin API consists of several ASP.NET Core API Controllers served from the `/StellarApi` base route. To prevent access to these controllers, you can implement a custom [Authorization Filter](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters) that ensures only administrators can access these API endpoints.

Add the following `StellarApiAuthorizationFilter` class to your application:

```cs
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace MyApplication
{
    public class StellarApiAuthorizationFilter : IAsyncAuthorizationFilter
    {
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            if (context.HttpContext.Request.Path.StartsWithSegments(new PathString("/stellarapi")))
            {
                var policyProvider = context.HttpContext.RequestServices.GetRequiredService<IAuthorizationPolicyProvider >();
                var policy = await policyProvider.GetPolicyAsync("IsAdministrator");
                if (policy != null)
                {
                    var policyEvaluator = context.HttpContext.RequestServices.GetRequiredService<IPolicyEvaluator>();
                    var authenticateResult = await policyEvaluator.AuthenticateAsync(policy, context.HttpContext);

                    var authorizeResult = await policyEvaluator.AuthorizeAsync(
                        policy, authenticateResult, context.HttpContext, context);

                    if (authorizeResult.Challenged)
                    {
                        context.Result = new ChallengeResult(policy.AuthenticationSchemes.ToArray());
                    }
                    else if (authorizeResult.Forbidden)
                    {
                        context.Result = new ForbidResult(policy.AuthenticationSchemes.ToArray());
                    }
                }
            }
        }
    }
}
```

Then add this filter when calling `AddControllers` in your startup class. The `ConfigureServices` method of your application should look similar to the following:

```cs
public void ConfigureServices(IServiceCollection services)
{
    // ...

    // Define IsAdministrator policy that checks whether the user is in the Administrator role
    services.AddAuthorization(o =>
    {
        o.AddPolicy("IsAdministrator", builder => builder.RequireRole("Administrator"));
    });

    // Add the StellarApiAuthorizationFilter which ensures only Administrators can access
    // the StellarAdmin API endpoints
    services.AddControllers(o =>
    {
        o.Filters.Add(new StellarApiAuthorizationFilter());
    });

    // Ensure only Administrators can access the Razor Page serving the StellarAdmin UI
    services.AddRazorPages(o =>
    {
        o.Conventions.AuthorizePage("/StellarAdmin", "IsAdministrator");
    });

    // Add all the StellarAdmin services
    services.AddStellarAdmin();
}
```

You can find a complete example at [https://github.com/stellar-admin/samples/tree/master/Authorization](https://github.com/stellar-admin/samples/tree/master/Authorization).