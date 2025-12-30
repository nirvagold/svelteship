<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';

	interface OnboardingStep {
		id: string;
		title: string;
		description: string;
	}

	interface Props {
		steps: OnboardingStep[];
		currentStep?: number;
		onComplete?: () => void;
		onSkip?: () => void;
		children?: Snippet<[{ step: OnboardingStep; index: number }]>;
	}

	let {
		steps,
		currentStep = $bindable(0),
		onComplete,
		onSkip,
		children
	}: Props = $props();

	const totalSteps = $derived(steps.length);
	const progress = $derived(((currentStep + 1) / totalSteps) * 100);
	const isFirstStep = $derived(currentStep === 0);
	const isLastStep = $derived(currentStep === totalSteps - 1);
	const currentStepData = $derived(steps[currentStep]);

	function nextStep() {
		if (isLastStep) {
			onComplete?.();
		} else {
			currentStep++;
		}
	}

	function prevStep() {
		if (!isFirstStep) {
			currentStep--;
		}
	}

	function skip() {
		onSkip?.();
	}
</script>

<div class="w-full max-w-2xl mx-auto">
	<!-- Progress -->
	<div class="mb-8">
		<div class="flex justify-between text-sm text-base-content/60 mb-2">
			<span>Step {currentStep + 1} of {totalSteps}</span>
			<span>{Math.round(progress)}% complete</span>
		</div>
		<Progress value={progress} max={100} />
	</div>

	<!-- Step Content -->
	<div class="card bg-base-100 shadow-lg">
		<div class="card-body">
			<!-- Step Header -->
			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold mb-2">{currentStepData.title}</h2>
				<p class="text-base-content/70">{currentStepData.description}</p>
			</div>

			<!-- Step Content (rendered via snippet) -->
			<div class="py-4">
				{#if children}
					{@render children({ step: currentStepData, index: currentStep })}
				{/if}
			</div>

			<!-- Navigation -->
			<div class="flex items-center justify-between mt-6 pt-4 border-t border-base-300">
				<div>
					{#if !isFirstStep}
						<Button variant="ghost" onclick={prevStep}>
							← Back
						</Button>
					{:else}
						<Button variant="ghost" onclick={skip}>
							Skip for now
						</Button>
					{/if}
				</div>

				<div class="flex gap-2">
					<!-- Step indicators -->
					{#each steps as _, i (i)}
						<button
							type="button"
							class="w-2 h-2 rounded-full transition-colors"
							class:bg-primary={i === currentStep}
							class:bg-base-300={i !== currentStep}
							onclick={() => (currentStep = i)}
							aria-label="Go to step {i + 1}"
						></button>
					{/each}
				</div>

				<Button variant="primary" onclick={nextStep}>
					{isLastStep ? 'Complete' : 'Next →'}
				</Button>
			</div>
		</div>
	</div>
</div>
