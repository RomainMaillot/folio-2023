# Picture.vue

## Usage

```
<Picture :data="data.image" />
<Picture :data="data.image" :half="true" />
<Picture :data="data.image" :parallax="true" :third="true" />
```

The `Picture` component receives in data an object containing all image sizes.

Example :
```
{
	altText: null
	generic: "https://d29upnquwyri6y.cloudfront.net/uploads/_1920x9999_fit_center-center_99_none/TW_STILL_000_2022-03-23-181057_xmhp.png"
	genericDesktop: "https://d29upnquwyri6y.cloudfront.net/uploads/_1440x9999_fit_center-center_99_none/TW_STILL_000_2022-03-23-181057_xmhp.png"
	genericDesktopWebp: "https://d29upnquwyri6y.cloudfront.net/uploads/_1440x9999_fit_center-center_99_none/8456/TW_STILL_000_2022-03-23-181057_xmhp.webp"
	genericMobile: "https://d29upnquwyri6y.cloudfront.net/uploads/_750x9999_fit_center-center_99_none/TW_STILL_000_2022-03-23-181057_xmhp.png"
	genericMobileWebp: "https://d29upnquwyri6y.cloudfront.net/uploads/_750x9999_fit_center-center_99_none/8456/TW_STILL_000_2022-03-23-181057_xmhp.webp"
	genericTablet: "https://d29upnquwyri6y.cloudfront.net/uploads/_1024x9999_fit_center-center_99_none/TW_STILL_000_2022-03-23-181057_xmhp.png"
	genericTabletWebp: "https://d29upnquwyri6y.cloudfront.net/uploads/_1024x9999_fit_center-center_99_none/8456/TW_STILL_000_2022-03-23-181057_xmhp.webp"
	genericWebp: "https://d29upnquwyri6y.cloudfront.net/uploads/_1920x9999_fit_center-center_99_none/8456/TW_STILL_000_2022-03-23-181057_xmhp.webp"
	url: "https://d29upnquwyri6y.cloudfront.net/uploads/TW_STILL_000_2022-03-23-181057_xmhp.png"
	width: 2898
	height: 1630
}
```

In Craft, it is used with `graphql/imageFragment.graphql`.

In Wordpress, image sizes must be defined in `functions.php`.