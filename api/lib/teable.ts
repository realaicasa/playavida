interface TeableConfig {
  apiUrl: string;
  baseId: string;
  apiKey: string;
}

interface TeableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
  lastModifiedTime: string;
}

interface TeableListResponse {
  records: TeableRecord[];
  offset?: string;
}

interface TeableCreateResponse {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
}

class TeableClient {
  private config: TeableConfig;

  constructor(config: TeableConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}/bases/${this.config.baseId}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Teable API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async listRecords(tableId: string, params?: {
    filter?: string;
    sort?: string;
    maxRecords?: number;
    offset?: string;
  }): Promise<TeableListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.filter) searchParams.set('filter', params.filter);
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.maxRecords) searchParams.set('maxRecords', params.maxRecords.toString());
    if (params?.offset) searchParams.set('offset', params.offset);

    const queryString = searchParams.toString();
    const endpoint = `/tables/${tableId}/records${queryString ? `?${queryString}` : ''}`;
    return this.request<TeableListResponse>(endpoint);
  }

  async createRecord(tableId: string, fields: Record<string, unknown>): Promise<TeableCreateResponse> {
    const endpoint = `/tables/${tableId}/records`;
    return this.request<TeableCreateResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ fields }),
    });
  }

  async updateRecord(tableId: string, recordId: string, fields: Record<string, unknown>): Promise<TeableRecord> {
    const endpoint = `/tables/${tableId}/records/${recordId}`;
    return this.request<TeableRecord>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    });
  }

  async deleteRecord(tableId: string, recordId: string): Promise<void> {
    const endpoint = `/tables/${tableId}/records/${recordId}`;
    await this.request(endpoint, { method: 'DELETE' });
  }

  async getRecord(tableId: string, recordId: string): Promise<TeableRecord> {
    const endpoint = `/tables/${tableId}/records/${recordId}`;
    return this.request<TeableRecord>(endpoint);
  }
}

function getTeableConfig(): TeableConfig {
  const apiUrl = process.env.TEABLE_API_BASE || process.env.TEABLE_API_URL;
  const baseId = process.env.TEABLE_BASE_ID;
  const apiKey = process.env.TEABLE_API_KEY;

  if (!apiUrl || !baseId || !apiKey) {
    throw new Error('Missing Teable configuration: TEABLE_API_BASE, TEABLE_BASE_ID, TEABLE_API_KEY required');
  }

  return { apiUrl, baseId, apiKey };
}

export function getTeableClient(): TeableClient {
  return new TeableClient(getTeableConfig());
}

export { TeableClient };
export type { TeableRecord, TeableListResponse, TeableCreateResponse, TeableConfig };