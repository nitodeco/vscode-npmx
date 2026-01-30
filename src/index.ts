import { defineExtension } from 'reactive-vscode'
import { languages } from 'vscode'
import { displayName, version } from './generated-meta'
import { registerJsonCompletionItemProvider } from './providers/completion-item/json'
import { PackageJsonLinkProvider } from './providers/packageJsonLink'
import { logger } from './state'

export const { activate, deactivate } = defineExtension((ctx) => {
  logger.info(`${displayName} Activated, v${version}`)

  ctx.subscriptions.push(
    languages.registerDocumentLinkProvider(
      { pattern: '**/package.json' },
      new PackageJsonLinkProvider(),
    ),
    registerJsonCompletionItemProvider(),
  )
})
