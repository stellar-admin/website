title: Defining fields for your resource
nav-title: Fields
order: 6
---

## Specifying display fields

Display fields are fields that will be displayed to the user in the various views, such as the resource index view, resource detail view, and the edit and create views. You can specify the display fields of your resource by calling the `AddField()` method when registering your resource. The `AddField` method takes an `expression` parameter which specifies a lambda expression that must be evaluated to return the value of the field.

Let's assume you have the following `Author` class defined.

```cs
public class Author
{
    public string Bio { get; set; }

    public int Id { get; set; }

    public string Name { get; set; }

    public string Photo { get; set; }
}
```

When registering the resource for the `Author` class, you can define each of the display fields as follow:

```cs
builder.AddResource<Author>(rb =>
{
    rb.AddField(a => a.Photo);
    rb.AddField(a => a.Name);
    rb.AddField(a => a.Bio);
});
```

 Note that in the code example above we did not declare a display field for the `Id` property. This is because the `Id` property is the key field and not something we necessarily want to display to the user in the user interface.


### Specifying the name of the field

Each field requires a unique name which StellarAdmin will try and determine from the lambda expression passed to the `AddField()` method. This works when the lambda expression is a member expression, but if you create a complex expression, StellarAdmin will not be able to determine the name of the field. 

The following code represents a complex expression where StellarAdmin will not be able to determine the name of the field:

```cs
rb.AddField(a => $"{a.FirstName} {a.LastName}");
```

In this case, you will need to specify the optional `configure` parameter for the `AddField` method. You will be passed an instance of `FieldDefinitionBuilder<TResource>` that allows you to further configure the field. To specify the name of the field, you can call the `HasName()` method.

```cs
rb.AddField(a => $"{a.FirstName} {a.LastName}", f => f.HasName("Fullname"));
```

### Specifying display attributes

The `configure` callback parameter of the `AddField` method also allows you to control various display properties of the field. You can, for example, specify the **label** and **help text** for a field by calling the `HasLabel()` and `HasHelpText()` methods.

```cs
rb.AddField(a => a.Bio,
    f =>
    {
        f.HasLabel("Biography");
        f.HasHelpText("Enter a short biography of the author");
    });

```

## Specifying a key field

It is essential to specify a key field for a resource so StellarAdmin knows how to retrieve specific instances of a resource. StellarAdmin can automatically determine the key field of a resource under the following conditions:

* The property that represents the primary key of your class has a `[Key]` attribute specified
* When using the `DbContextDataSource`, StellarAdmin will request the primary key details from Entity Framework. This means that as long as Entity Framework can determine the primary key of your entity - whether that be by convention, Data Annotations or the Fluent API - StellarAdmin will be able to determine it as well.

In cases where the key field cannot be automatically determined, you can specify it manually when you register your resource as follows:

```cs
builder.AddResource<Author>(rb =>
{
    rb.HasKey(a => a.Id);
    
    // ...
});
```
