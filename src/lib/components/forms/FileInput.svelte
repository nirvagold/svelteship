<script lang="ts">
	interface Props {
		name: string;
		label?: string;
		accept?: string;
		multiple?: boolean;
		maxSize?: number;
		preview?: boolean;
		error?: string;
		helper?: string;
		required?: boolean;
		disabled?: boolean;
		class?: string;
		onchange?: (files: File[]) => void;
	}

	let {
		name,
		label,
		accept,
		multiple = false,
		maxSize,
		preview = false,
		error,
		helper,
		required = false,
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();

	const inputId = `fileinput-${name}-${Math.random().toString(36).slice(2, 9)}`;

	let files = $state<File[]>([]);
	let previews = $state<string[]>([]);
	let isDragging = $state(false);
	let inputElement: HTMLInputElement;

	function handleFiles(fileList: FileList | null) {
		if (!fileList) return;

		const newFiles = Array.from(fileList);
		files = multiple ? [...files, ...newFiles] : newFiles;

		if (preview) {
			generatePreviews();
		}

		onchange?.(files);
	}

	function generatePreviews() {
		previews.forEach((url) => URL.revokeObjectURL(url));
		previews = files
			.filter((file) => file.type.startsWith('image/'))
			.map((file) => URL.createObjectURL(file));
	}

	function removeFile(index: number) {
		if (previews[index]) {
			URL.revokeObjectURL(previews[index]);
		}
		files = files.filter((_, i) => i !== index);
		previews = previews.filter((_, i) => i !== index);
		onchange?.(files);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		handleFiles(e.dataTransfer?.files ?? null);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	$effect(() => {
		return () => {
			previews.forEach((url) => URL.revokeObjectURL(url));
		};
	});
</script>

<div class="form-control w-full {className}">
	{#if label}
		<label class="label" for={inputId}>
			<span class="label-text">
				{label}
				{#if required}<span class="text-error">*</span>{/if}
			</span>
		</label>
	{/if}

	<div
		class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
			{isDragging ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary'}
			{error ? 'border-error' : ''}"
		role="button"
		tabindex="0"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		onclick={() => inputElement?.click()}
		onkeydown={(e) => e.key === 'Enter' && inputElement?.click()}
	>
		<input
			bind:this={inputElement}
			id={inputId}
			type="file"
			{name}
			{accept}
			{multiple}
			{required}
			{disabled}
			class="hidden"
			onchange={(e) => handleFiles(e.currentTarget.files)}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
		/>

		<div class="flex flex-col items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-10 w-10 text-base-content/50"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/>
			</svg>
			<p class="text-sm text-base-content/70">
				Drag and drop files here, or click to select
			</p>
			{#if maxSize}
				<p class="text-xs text-base-content/50">Max size: {formatSize(maxSize)}</p>
			{/if}
		</div>
	</div>

	{#if files.length > 0}
		<div class="mt-3 space-y-2">
			{#each files as file, i (file.name + file.size)}
				<div class="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
					{#if preview && previews[i]}
						<img src={previews[i]} alt={file.name} class="w-12 h-12 object-cover rounded" />
					{/if}
					<div class="flex-1 min-w-0">
						<p class="text-sm truncate">{file.name}</p>
						<p class="text-xs text-base-content/50">{formatSize(file.size)}</p>
					</div>
					<button
						type="button"
						class="btn btn-ghost btn-sm btn-circle"
						onclick={() => removeFile(i)}
						aria-label="Remove file"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#if error}
		<label class="label" for={inputId}>
			<span id="{inputId}-error" class="label-text-alt text-error">{error}</span>
		</label>
	{:else if helper}
		<label class="label" for={inputId}>
			<span id="{inputId}-helper" class="label-text-alt">{helper}</span>
		</label>
	{/if}
</div>
