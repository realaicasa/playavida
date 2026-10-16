interface TeableConfig {
  apiUrl: string;
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
  records: Array<{
    id: string;
    fields: Record<string, unknown>;
    createdTime: string;
    lastModifiedTime: string;
  }>;
}

interface TeableField {
  id: string;
  name: string;
  type: string;
}

type FilterOperator = 'is' | 'isNot' | 'contains' | 'doesNotContain' | 'isGreater' | 'isGreaterEqual' | 'isLess' | 'isLessEqual' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'isEmpty' | 'isNotEmpty';

interface FilterCondition {
  fieldId: string;
  operator: FilterOperator;
  value?: unknown;
}

interface FilterGroup {
  conjunction: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
}

type Filter = FilterCondition | FilterGroup;

class TeableClient {
  private config: TeableConfig;
  private fieldIdCache: Map<string, Map<string, string>> = new Map();

  constructor(config: TeableConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;
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

  private async fetchFieldIds(tableId: string): Promise<Map<string, string>> {
    if (this.fieldIdCache.has(tableId)) {
      return this.fieldIdCache.get(tableId)!;
    }

    try {
      const fields = await this.request<TeableField[]>(`/table/${tableId}/field`);
      const mapping = new Map<string, string>();
      for (const field of fields) {
        mapping.set(field.name, field.id);
      }
      this.fieldIdCache.set(tableId, mapping);
      return mapping;
    } catch (error) {
      console.warn(`Failed to fetch field IDs for table ${tableId}:`, error);
      const emptyMap = new Map<string, string>();
      this.fieldIdCache.set(tableId, emptyMap);
      return emptyMap;
    }
  }

  async getFieldId(tableId: string, fieldName: string): Promise<string> {
    const mapping = await this.fetchFieldIds(tableId);
    const fieldId = mapping.get(fieldName);
    if (!fieldId) {
      console.warn(`Field ID not found for ${fieldName} in table ${tableId}, using name as fallback`);
      return fieldName;
    }
    return fieldId;
  }

  private mapOperator(op: FilterOperator): string {
    const opMap: Record<FilterOperator, string> = {
      'is': 'is',
      'isNot': 'isNot',
      'contains': 'contains',
      'doesNotContain': 'doesNotContain',
      'isGreater': 'isGreater',
      'isGreaterEqual': 'isGreaterEqual',
      'isLess': 'isLess',
      'isLessEqual': 'isLessEqual',
      'startsWith': 'startsWith',
      'endsWith': 'endsWith',
      'in': 'in',
      'notIn': 'notIn',
      'isEmpty': 'isEmpty',
      'isNotEmpty': 'isNotEmpty',
    };
    return opMap[op] || op;
  }

  private async serializeFilter(filter: Filter, tableId: string): Promise<object> {
    if ('fieldId' in filter) {
      const fieldId = await this.getFieldId(tableId, filter.fieldId);
      return {
        filterSet: [{
          fieldId,
          operator: this.mapOperator(filter.operator),
          value: filter.value,
        }],
        conjunction: 'and'
      };
    }
    // Group
    const serializedConditions = await Promise.all(
      filter.conditions.map(c => this.serializeFilter(c, tableId))
    );
    return {
      filterSet: serializedConditions,
      conjunction: filter.conjunction.toLowerCase()
    };
  }

  async listRecords(tableId: string, params?: {
    filter?: Filter | string;
    sort?: string;
    maxRecords?: number;
    offset?: string;
  }): Promise<TeableListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.filter) {
      const filterObj = typeof params.filter === 'string'
        ? params.filter
        : JSON.stringify(await this.serializeFilter(params.filter, tableId));
      searchParams.set('filter', filterObj);
    }
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.maxRecords) searchParams.set('maxRecords', params.maxRecords.toString());
    if (params?.offset) searchParams.set('offset', params.offset);

    const queryString = searchParams.toString();
    const endpoint = `/table/${tableId}/record${queryString ? `?${queryString}` : ''}`;
    return this.request<TeableListResponse>(endpoint);
  }

  async createRecord(tableId: string, fields: Record<string, unknown>): Promise<TeableCreateResponse> {
    const endpoint = `/table/${tableId}/record`;
    return this.request<TeableCreateResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ records: [{ fields }] }),
    });
  }

  async updateRecord(tableId: string, recordId: string, fields: Record<string, unknown>): Promise<TeableRecord> {
    const endpoint = `/table/${tableId}/record/${recordId}`;
    return this.request<TeableRecord>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    });
  }

  async deleteRecord(tableId: string, recordId: string): Promise<void> {
    const endpoint = `/table/${tableId}/record/${recordId}`;
    await this.request(endpoint, { method: 'DELETE' });
  }

  async getRecord(tableId: string, recordId: string): Promise<TeableRecord> {
    const endpoint = `/table/${tableId}/record/${recordId}`;
    return this.request<TeableRecord>(endpoint);
  }
}

function getTeableConfig(): TeableConfig {
  const apiUrl = process.env.TEABLE_API_BASE;
  const apiKey = process.env.TEABLE_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('Missing Teable configuration: TEABLE_API_BASE, TEABLE_API_KEY required');
  }

  return { apiUrl, apiKey };
}

export function getTeableClient(): TeableClient {
  return new TeableClient(getTeableConfig());
}

export { TeableClient };
export type { TeableRecord, TeableListResponse, TeableCreateResponse, TeableConfig, Filter, FilterCondition, FilterGroup };