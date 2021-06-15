xref: get-started
order: 2
---

## Requirements

StellarAdmin requires ASP.NET Core 3.1 or 5.0

## Install packages

To add StellarAdmin to your ASP.NET Core application, install the `StellarAdmin` NuGet package. If you intend to use StellarAdmin with Entity Framework, you can also install the `StellarAdmin.EntityFrameworkCore` package.

```bash
dotnet add package StellarAdmin
dotnet add package StellarAdmin.EntityFrameworkCore
```

## Register StellarAdmin services

Once installed, you must configure StellarAdmin in the `ConfigureServices` method of your `Startup` class by calling the `AddStellarAdmin` extension method. StellarAdmin depends on some **MVC** services, so be sure to register those by calling the `AddMvc` extension method.

```cs
public void ConfigureServices(IServiceCollection services)
{
    // some code omitted for brevity

    // StellarAdmin requires various MVC services
    services.AddMvc();

    // Register the StellarAdmin services, resources and actions
    services.AddStellarAdmin();
}
```

## Register endpoints

To register the StellarAdmin endpoints, add a call to `MapStellarAdmin()` in the `Configure` method of your `Startup` class. Also ensure that you have registered the Static File Middleware by calling the `UseStaticFiles()` method.

```cs
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ...

    // The Static File Middleware is required by StellarAdmin
    app.UseStaticFiles();

    app.UseEndpoints(endpoints =>
    {
        // other endpoint registrations

        // Register the routes for the StellarAdmin UI and API
        endpoints.MapStellarAdmin();
    });
}
```

## Verify configuration

You can verify the configuration running your application and going to the `/StellarAdmin` route. This should display the StellerAdmin UI as in the screenshot below.

![](no-resources.png)

## Next

Next, you can define your resources.

* [Define resources](resources)