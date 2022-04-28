GeneralLink Component

----------------------------------------------------------------------------------------------------------------------

GraphQL query

Ex: 
linkFieldInACF{
    title
    url
    target
}

----------------------------------------------------------------------------------------------------------------------

Usage:

Ex: Simple link with text only
<GeneralLink :data="data.linkFieldInACF" class="className"></GeneralLink>

-----------------------------------------------------------

Ex: Complex link element.
Pass the html content as a slot
NOTE: v-if="data.linkFieldInACF" is important in case the field in empty in Wordpress. Otherwise {{ data.linkFieldInACF.title }} will fail
<GeneralLink :data="data.linkFieldInACF" class="className" v-if="data.linkFieldInACF"><span>{{ data.linkFieldInACF.title }}<i class="icon"></i></span></GeneralLink>

-----------------------------------------------------------

Ex: As a base for a more complex component
LinkArrow.vue
--------------------
<template>
  <GeneralLink :data="data" class="link--arrow" v-if="data"><IconProfil /><span>{{ data.title }}</span></GeneralLink>
</template>
​
<script>
  export default {
  	props: ['data']
  }
</script>
​
<style lang="scss">
@import './link-arrow.scss';
</style>
--------------------

-----------------------------------------------------------