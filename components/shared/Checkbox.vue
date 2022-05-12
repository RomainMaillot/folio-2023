<template>
	<div class="checkbox">
		<label class="container">
			<input type="checkbox" :checked="isSelected" :value="value" v-on:change="onChange" :class="value" v-on:keyup.enter="onChange" />
			<span class="checkmark"></span>
			<slot></slot>
		</label>
	</div>
</template>

<script>
export default {
	props: ['isSelected', 'change', 'value'],
	methods: {
		onChange() {
			this.$emit('onChange', this.value);
		},
	},
};
</script>

<style lang="scss">
/* Customize the label (the container) */
.checkbox {
	&__label {
		display: flex;
		align-items: center;

		svg {
			width: 24px;
			height: 24px;
			margin-right: 10px;
		}
		span {
			font-size: 16px;
			line-height: 28px;
		}
	}

	&.isFocused {
		.checkmark {
			border: 2px solid black;
			display: block;
		}
	}

	.container {
		display: block;
		position: relative;
		padding-left: 35px;
		margin-bottom: 12px;
		cursor: pointer;
		// font-size: 22px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	/* Hide the browser's default checkbox */
	.container input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
		/*
    Provide basic, default focus styles.
    */
		&:focus,
		&:focus-visible {
			& ~ .checkmark {
				outline: 1px solid black;
				display: block;
			}
			font-weight: bold;
			& ~ .checkbox__label {
				font-weight: bold;
			}
		}

		/*
      Remove default focus styles for mouse users ONLY if
      :focus-visible is supported on this platform.
    */
		&:focus:not(:focus-visible) {
			& ~ .checkmark {
				outline: 1px solid black;
				display: block;
			}
			font-weight: normal;
			& ~ .checkbox__label {
				font-weight: normal;
			}
		}
	}

	/* Create a custom checkbox */
	.checkmark {
		position: absolute;
		left: 0;
		top: -1px;
		height: 20px;
		width: 20px;
		background-color: transparent;
		border-radius: 5px;
		border: 1px solid #dbe2e2;
		box-shadow: inset 5px 5px 8px rgb(12 22 55 / 8%);
		background: #ffffff;
		box-sizing: border-box;
		&:hover {
			outline: none !important;
		}
	}
	&:hover {
		.checkmark {
			outline: none !important;
		}
	}
	/* On mouse-over, add a grey background color */
	.container:hover input ~ .checkmark {
		border: 1px solid var(--color-main);
	}

	/* Create the checkmark/indicator (hidden when not checked) */
	.checkmark:after {
		content: '';
		position: absolute;
		display: none;
	}

	/* Show the checkmark when checked */
	.container input:checked ~ .checkmark:after {
		display: block;
	}

	/* Style the checkmark/indicator */
	.container .checkmark:after {
		left: 6px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid var(--color-main);
		border-width: 0 1px 1px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}
}
</style>
