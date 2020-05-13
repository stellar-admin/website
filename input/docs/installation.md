xref: get-started
order: 2
---

## Requirements

StellarAdmin requires ASP.NET Core 3.1.

## Installing the NuGet packages

To add StellarAdmin to your ASP.NET Core application, you will need to install the `StellarAdmin` NuGet package.

```bash
dotnet add package StellarAdmin
```

If you intend to use StellarAdmin with Entity Framework 3, you can also install the `StellarAdmin.EntityFrameworkCore` package.

```bash
dotnet add package StellarAdmin.EntityFrameworkCore
```

## Registering the services

Once installed, you will need to configure StellarAdmin in your application's `Startup` class by calling the `AddStellarAdmin` extension method inside the `ConfigureServices` method. StellarAdmin also depends on the **Razor Pages** services, so be sure to register those by calling the `AddRazorPages` extension method.

```cs
public void ConfigureServices(IServiceCollection services)
{
    // some code omitted for brevity

    services.AddRazorPages();
    services.AddStellarAdmin();
}
```

## Registering the StellarAdmin routing endpoints

The final part of the configuration is to add the endpoints for StellarAdmin in the `Configure` method of your `Startup` class. Once again, StellarAdmin depends on some **Controller** and **Razor Page**s endpoints, so you will need ensure those are registered by calling the `MapControllers` and `MapRazorPages` extension methods. After those are added, you can add the StellarAdmin endpoints by calling the `MapStellarAdmin` extension method.

```cs
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // some code omitted for brevity

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
        endpoints.MapRazorPages();

        endpoints.MapStellarAdmin();
    });
}
```

## Confirming the configuration

You can now confirm that the configuration is correct by running your application. Once your application has started, you can view the StellarAdmin dashboard by visiting the `/StellarAdmin` route of you application.

... screenshot

## Up next

Next, you can start defining your resources.
