import type { DocumentLinkProvider, TextDocument } from 'vscode'
import { findNodeAtLocation } from 'jsonc-parser'
import { DocumentLink, Uri } from 'vscode'
import { getJsonAst, getNodeRange } from '../utils/jsonAst'

const sections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
]

export class PackageJsonLinkProvider implements DocumentLinkProvider {
  provideDocumentLinks(document: TextDocument) {
    if (!document.fileName.endsWith('package.json'))
      return

    const root = getJsonAst(document)
    if (!root)
      return

    const links: DocumentLink[] = []

    sections.forEach((section) => {
      const node = findNodeAtLocation(root, [section])
      if (!node || !node.children)
        return

      for (const dep of node.children) {
        const keyNode = dep.children?.[0]
        if (!keyNode || typeof keyNode.value !== 'string')
          continue

        const range = getNodeRange(document, keyNode)
        const uri = Uri.parse(`https://npmx.dev/package/${keyNode.value}`)

        links.push(new DocumentLink(range, uri))
      }
    })

    return links
  }
}
