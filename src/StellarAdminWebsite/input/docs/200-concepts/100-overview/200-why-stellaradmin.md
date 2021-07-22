title: Why StellarAdmin?
---

A few years ago, I (Jerrie Pelser, the creator of StellarAdmin) started working on a new startup. Since I was a bootstrapping solo founder, I had to carefully consider how I spent my time. It was not enough that I had to carefully balance my time between programming, marketing, support, and administrative duties, but I also had to carefully consider what I spent those programming hours on.

I would have very much preferred to have spent that time only on developing customer facing features of my application, but the reality was that I also had to spend some of that time developing internal admin tools to better support my customers.

In my experience most of these admin screens followed a fairly predictable pattern:

* Display a list of records with perhaps search or filtering of records.
* Be able to add new records, edit and delete records.
* Perform custom actions such as issuing a refund or extending a customer's trial period.

Even though these screens tended to be simple in terms of functionality, they still took a significant time to develop. This is time I could have better spent working on the customer facing features of my application or marketing.

I was amazed that there was no easy way to rapidly develop these admin screens in ASP.NET Core. Other web development frameworks seems to have an abundance of these tools. Tools such as [Nova](https://nova.laravel.com/) and [Backpack](https://backpackforlaravel.com/) in the Laravel community, [EasyAdmin](https://symfony.com/doc/current/bundles/EasyAdminBundle/index.html) for Symfony, [ActiveAdmin](https://activeadmin.info/) and [ForestAdmin](https://www.forestadmin.com/) for Rails, and the list goes on.

Sadly, my earlier startup did not work out, but I once again ran into this requirement for having an easy way to develop admin screens for clients that I did freelance work for.

So, I took inspiration from the many Admin Panels available for other web frameworks and set out to provide something similar to the ASP.NET Core community.

**And that is how StellarAdmin was born.**

I hope that StellarAdmin will save you time and allow you to spend that time on other important parts of your business, your client's business, or your employer's business.