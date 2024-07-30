/**
 * @file Provides a CLI to create a new component
 */

const fs = require('fs/promises');
const { print } = require('./print.cjs');
const json = require('../package.json');
const { createSpinner } = require('nanospinner');

const spinner = createSpinner();

/**
 * @type {import('node').process}
 */

/**
 * @type {import('node').fs}
 */


/**
 * Main function to run
 * @async
 * @returns {void}
 */
const main = async () => {
	const [
		,
		,
		arg,
		...args
	] = process.argv;

	if (!arg) {
		print('error', 'No component name specified.');

		return;
	}

	/** @type {number} */
	const element = args.indexOf('-e');

	/** @type {number} */
	const path = args.indexOf('-d');

	const src = json.comprc?.dir || './components';

	let el = 'div';
	let dir = `${src}/${arg}`;

	if (element > -1) {
		/** @type {string} */
		const name = args[element + 1];

		if (name) {
			el = name;
		}
	}

	if (path > -1) {
		/** @type {string} */
		const name = args[path + 1];

		if (name) {
			dir = `./${name}/${arg}`;
		}
	}

	/** @type {string} */
	const name = arg
		.replace(/(?!^)[A-Z]/g, '-$&')
		.toLowerCase();

	const exportFrom = `export * from './${arg}';\n`;

	const component = `'use client';\n\nimport type { FC } from 'react';\nimport type { ${arg}Props, Styled${arg}Props } from './types';\n\nimport styled from 'styled-components';\n\n\nexport const Root = styled.${el}<Styled${arg}Props>\`\`;\n\n\nexport const ${arg}: FC<${arg}Props> = ({ className, ...props }) => (\n\t<Root className={className} {...props}>Content</Root>\n);\n\n`;
	const types = `import type { ComponentPropsWithRef } from 'react';\n\n\nexport type ${arg}Props = ComponentPropsWithRef<'${el}'> & {\n\tchildren?: never;\n}\n\nexport type Styled${arg}Props = {}\n`;
	const index = `${exportFrom}export * from './types.d';\n`;
	const test = `import { render, screen } from '@testing-library/react';\nimport { axe } from 'jest-axe';\nimport { ${arg} } from '.';\n\n\ndescribe('${arg}', () => {\n	test('renders its content', async () => {\n		render(<${arg} />);\n\n		const intro = await screen.findByText(/content/i);\n\n		/**\n		 * @note Placeholder assertion:\n		 * This is redundant as 'findByText' will error if not present.\n		 * Remove when writing your own tests.\n		 */\n		expect(intro).toBeInTheDocument();\n	});\n\n	test('is accessible', async () => {\n		const { container } = render(<${arg} />);\n\n		const element = await axe(container);\n\n		expect(element).toHaveNoViolations();\n	});\n});\n`;

	spinner.start({
		color: 'yellow',
		text: 'Creating your component...\n',
	});

	try {
		await fs.mkdir(dir, { recursive: true });
	} catch (e) {
		if (e.code === 'EEXIST') {
			print('warn', `${dir} already exists.`);
		}

		if (e.code === 'ENOENT') {
			print('error', `${dir} does not exist.`);
		}

		return;
	}

	await fs.writeFile(`${dir}/index.ts`, index);
	await fs.writeFile(`${dir}/types.d.ts`, types);
	await fs.writeFile(`${dir}/${arg}.tsx`, component);
	await fs.writeFile(`${dir}/${name}.test.tsx`, test);
	await fs.appendFile(`${src}/index.ts`, exportFrom);

	setTimeout(() => {
		spinner.stop({
			text: `Component ${arg} created!\n`,
			mark: '🎉',
		});
		spinner.clear();
	}, 1000);
};

main();
