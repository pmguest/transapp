// Hand-written to match supabase/migrations/0001_init.sql.
//
// This is NOT generated from a live project — there isn't one linked yet
// (see .env.example / README). Once a Supabase project exists, regenerate
// this file for real with:
//
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts
//
// and delete this notice. Keep it hand-in-sync with the migrations directory
// until then: any new migration file needs a matching edit here.

export type DocumentStatus =
  | "uploaded"
  | "extracting"
  | "anonymizing"
  | "translating"
  | "correcting"
  | "qa_checking"
  | "structural_checking"
  | "formatting_checking"
  | "deanonymizing"
  | "awaiting_human_review"
  | "complete"
  | "failed";

export type EntityType =
  | "PERSON"
  | "COMPANY"
  | "ADDRESS"
  | "EMAIL"
  | "PHONE"
  | "ID_NUMBER"
  | "DATE";

export type PipelineStageStatus = "pending" | "running" | "passed" | "failed";

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          created_at: string;
          original_filename: string;
          source_language: string | null;
          target_language: string | null;
          source_storage_path: string | null;
          extracted_text: string | null;
          current_stage: number;
          status: DocumentStatus;
          final_text: string | null;
          error: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          original_filename: string;
          source_language?: string | null;
          target_language?: string | null;
          source_storage_path?: string | null;
          extracted_text?: string | null;
          current_stage?: number;
          status?: DocumentStatus;
          final_text?: string | null;
          error?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
      };
      entity_mappings: {
        Row: {
          id: string;
          document_id: string;
          placeholder: string;
          entity_type: EntityType;
          real_value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          placeholder: string;
          entity_type: EntityType;
          real_value: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["entity_mappings"]["Insert"]
        >;
      };
      pipeline_stage_runs: {
        Row: {
          id: string;
          document_id: string;
          stage: number;
          stage_name: string;
          status: PipelineStageStatus;
          output: unknown | null;
          started_at: string | null;
          completed_at: string | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          stage: number;
          stage_name: string;
          status?: PipelineStageStatus;
          output?: unknown | null;
          started_at?: string | null;
          completed_at?: string | null;
          error?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["pipeline_stage_runs"]["Insert"]
        >;
      };
    };
  };
}
