<template>
	<div class="scroll-trigger__wrapper">
		<div class="scroll-trigger__translate-in">
			<p class="scroll-trigger__para" v-translate-in>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit.
				Quaerat, ipsam deserunt! Optio velit at distinctio voluptatem,
				animi, consectetur sed repellendus esse neque dolore obcaecati
				totam quos rem, cumque voluptate iste.
			</p>
		</div>

		<div
			class="scroll-trigger__translate-in-child"
			v-translate-in="{
				target: 'childs',
				trigger: 'self',
				duration: 0.6,
				axis: 'y',
				distanceFrom: 100,
				distanceTo: 0,
				stagger: 0.1,
				animateOpacity: true,
			}">
			<p class="scroll-trigger__para">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit.
				Quaerat, ipsam deserunt! Optio velit at distinctio voluptatem,
				animi, consectetur sed repellendus esse neque dolore obcaecati
				totam quos rem, cumque voluptate iste.
			</p>
			<p class="scroll-trigger__para">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit.
				Quaerat, ipsam deserunt! Optio velit at distinctio voluptatem,
				animi, consectetur sed repellendus esse neque dolore obcaecati
				totam quos rem, cumque voluptate iste.
			</p>
			<p class="scroll-trigger__para">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit.
				Quaerat, ipsam deserunt! Optio velit at distinctio voluptatem,
				animi, consectetur sed repellendus esse neque dolore obcaecati
				totam quos rem, cumque voluptate iste.
			</p>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.scroll-trigger {
	&__wrapper {
		padding: 40px;
		padding-bottom: 300px;
	}

	&__para {
		width: 400px;
		opacity: 0;
		padding-bottom: 100px;
	}

	&__translate-in-child {
		display: flex;
		gap: 40px;
	}
}
</style>
