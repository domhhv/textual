-- Utility functions for the application

-- Function to automatically update updated_at with current timestamp on row update
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger" --noqa
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;
