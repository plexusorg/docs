export const API_BASE = 'https://updater.plex.us.org';

export const CHANNELS = ['stable', 'dev'];

export const CHANNEL_LABELS: Record<string, string> = {stable: 'Stable', dev: 'Dev'};

export interface Project {
    name: string;
    jenkins?: string;
}

export interface Build {
    buildNumber: string;
    version: string;
    channel?: string;
    commit?: string;
    downloadUrl: string;
    sha256?: string;
    size?: number;
    publishedAt: string;
    minecraftVersions?: string[];
    apiCompatibility?: number;
}

export interface ProjectIndex {
    name: string;
    kind: string;
    versions?: string[];
    latest?: Record<string, Record<string, string>>;
}

export interface LoadedProject extends Project {
    index?: ProjectIndex;
    channels: Record<string, Build>;
    error?: string;
}

export interface VersionBuilds {
    version: string;
    builds: Build[];
}

export const PROJECTS: Project[] = [
    {name: 'Plex', jenkins: 'https://ci.plex.us.org/job/Plex/job/master/'},
    {name: 'Module-FalseOp'},
    {name: 'Module-Guilds'},
    {name: 'Module-HTTPD'},
    {name: 'Module-LibsDisguises'},
    {name: 'Module-NickMiniMessage'},
    {name: 'Module-NUSH'},
    {name: 'Module-TFMExtras'},
];

export function displayName(name: string): string {
    return name.replace(/^Module-/, '');
}

export function projectSlug(name: string): string {
    return displayName(name).toLowerCase();
}

export function projectPath(name: string, channel?: string | null): string {
    const path = `/downloads/${projectSlug(name)}`;
    return channel ? `${path}?channel=${channel}` : path;
}

export function findProject(slug: string): Project | undefined {
    return PROJECTS.find((project) => projectSlug(project.name) === slug);
}

export function jenkinsUrl(project: Project): string {
    return project.jenkins ?? `https://ci.plex.us.org/job/${project.name}/`;
}

export async function fetchJson(path: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${path}`, {
        signal: AbortSignal.timeout(5000),
        // @ts-ignore -- cf is Workers-specific; ignored by astro dev
        cf: {cacheTtl: 60, cacheEverything: true},
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${path}`);
    }
    return await response.json();
}

function latestPointerPath(index: ProjectIndex, channel: string): string | null {
    const pointers = index.latest?.[channel];
    if (!pointers) {
        return null;
    }
    if (index.kind === 'plex') {
        return pointers['minecraft'] ?? null;
    }
    let bestKey = null;
    let bestApi = -1;
    for (const key of Object.keys(pointers)) {
        const match = key.match(/^api\/(\d+)$/);
        if (match && Number(match[1]) > bestApi) {
            bestApi = Number(match[1]);
            bestKey = key;
        }
    }
    return bestKey ? pointers[bestKey] : null;
}

export async function loadProject(project: Project): Promise<LoadedProject> {
    try {
        const index = await fetchJson(`api/v1/projects/${project.name}.json`);
        const channels: Record<string, Build> = {};
        await Promise.all(CHANNELS.map(async (channel) => {
            const path = latestPointerPath(index, channel);
            if (path) {
                channels[channel] = await fetchJson(path);
            }
        }));
        return {...project, index, channels};
    } catch (error) {
        return {...project, channels: {}, error: error instanceof Error ? error.message : String(error)};
    }
}

export async function loadBuildHistory(project: Project): Promise<VersionBuilds[]> {
    const index: ProjectIndex = await fetchJson(`api/v1/projects/${project.name}.json`);
    const versions = index.versions ?? [];
    return await Promise.all(versions.map(async (version) => {
        const data = await fetchJson(`api/v1/projects/${project.name}/versions/${version}/builds.json`);
        return {version, builds: Array.isArray(data.builds) ? data.builds : []};
    }));
}

const dateFormat = new Intl.DateTimeFormat('en-US', {dateStyle: 'medium', timeZone: 'UTC'});

export function formatDate(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? iso : dateFormat.format(date);
}

export function formatSize(bytes?: number): string | null {
    if (typeof bytes !== 'number' || bytes <= 0) {
        return null;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
