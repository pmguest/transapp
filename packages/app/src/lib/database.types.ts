// Hand-written TypeScript types to match the Supabase schema. Regenerate with
// `supabase gen types typescript > src/lib/database.types.ts` after any schema
// changes once a live project is linked; until then, keep these in sync
// manually with supabase/migrations/*.sql files.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          created_at: string
          original_filename: string
          source_language: string | null
          target_language: string | null
          source_storage_path: string | null
          extracted_text: string | null
          current_stage: number
          status: string
          final_text: string | null
          error: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          original_filename: string
          source_language?: string | null
          target_language?: string | null
          source_storage_path?: string | null
          extracted_text?: string | null
          current_stage?: number
          status?: string
          final_text?: string | null
          error?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          original_filename?: string
          source_language?: string | null
          target_language?: string | null
          source_storage_path?: string | null
          extracted_text?: string | null
          current_stage?: number
          status?: string
          final_text?: string | null
          error?: string | null
        }
      }
      entity_mappings: {
        Row: {
          id: string
          document_id: string
          placeholder: string
          entity_type: string
          real_value: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          placeholder: string
          entity_type: string
          real_value: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          placeholder?: string
          entity_type?: string
          real_value?: string
          created_at?: string
        }
      }
      pipeline_stage_runs: {
        Row: {
          id: string
          document_id: string
          stage: number
          stage_name: string
          status: string
          output: Json | null
          started_at: string | null
          completed_at: string | null
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          stage: number
          stage_name: string
          status?: string
          output?: Json | null
          started_at?: string | null
          completed_at?: string | null
          error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          stage?: number
          stage_name?: string
          status?: string
          output?: Json | null
          started_at?: string | null
          completed_at?: string | null
          error?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
