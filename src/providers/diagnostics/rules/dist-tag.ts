import type { DiagnosticRule } from '..'
import { COMMON_DIST_TAGS } from '#constants'
import { npmxPackageUrl } from '#utils/links'
import { isSupportedProtocol, parseVersion } from '#utils/package'
import { DiagnosticSeverity, Uri } from 'vscode'

export const checkDistTag: DiagnosticRule = (dep, pkg) => {
  const parsed = parseVersion(dep.version)
  if (!parsed || !isSupportedProtocol(parsed.protocol))
    return

  const tag = parsed.semver
  const isPublishedDistTag = tag in (pkg.distTags ?? {})
  const isCommonDistTag = COMMON_DIST_TAGS.has(tag.toLowerCase())
  if (!isPublishedDistTag && !isCommonDistTag)
    return

  return {
    node: dep.versionNode,
    message: `"${dep.name}" uses the "${tag}" version tag. This may lead to unexpected breaking changes. Consider pinning to a specific version.`,
    severity: DiagnosticSeverity.Warning,
    code: {
      value: 'dist-tag',
      target: Uri.parse(npmxPackageUrl(dep.name)),
    },
  }
}
