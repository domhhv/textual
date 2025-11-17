SET check_function_bodies = "off";

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() --noqa
RETURNS trigger
LANGUAGE "plpgsql"
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;
