CREATE TABLE "public"."documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL DEFAULT ("auth"."jwt"() ->> 'sub'::TEXT), -- noqa: CV10
    "title" TEXT,
    "description" TEXT,
    "content" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX "documents_pkey" ON "public"."documents" USING "btree" ("id");

ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_pkey" PRIMARY KEY USING INDEX "documents_pkey";

GRANT DELETE ON TABLE "public"."documents" TO "anon";

GRANT INSERT ON TABLE "public"."documents" TO "anon";

GRANT REFERENCES ON TABLE "public"."documents" TO "anon";

GRANT SELECT ON TABLE "public"."documents" TO "anon";

GRANT TRIGGER ON TABLE "public"."documents" TO "anon";

GRANT TRUNCATE ON TABLE "public"."documents" TO "anon";

GRANT UPDATE ON TABLE "public"."documents" TO "anon";

GRANT DELETE ON TABLE "public"."documents" TO "authenticated";

GRANT INSERT ON TABLE "public"."documents" TO "authenticated";

GRANT REFERENCES ON TABLE "public"."documents" TO "authenticated";

GRANT SELECT ON TABLE "public"."documents" TO "authenticated";

GRANT TRIGGER ON TABLE "public"."documents" TO "authenticated";

GRANT TRUNCATE ON TABLE "public"."documents" TO "authenticated";

GRANT UPDATE ON TABLE "public"."documents" TO "authenticated";

GRANT DELETE ON TABLE "public"."documents" TO "service_role";

GRANT INSERT ON TABLE "public"."documents" TO "service_role";

GRANT REFERENCES ON TABLE "public"."documents" TO "service_role";

GRANT SELECT ON TABLE "public"."documents" TO "service_role";

GRANT TRIGGER ON TABLE "public"."documents" TO "service_role";

GRANT TRUNCATE ON TABLE "public"."documents" TO "service_role";

GRANT UPDATE ON TABLE "public"."documents" TO "service_role";

CREATE POLICY "User can view their own documents"
ON "public"."documents"
AS PERMISSIVE
FOR SELECT
TO "authenticated"
USING (((select("auth"."jwt"() ->> 'sub'::TEXT)) = "user_id")); -- noqa: CV10

CREATE POLICY "Users can delete their own documents"
ON "public"."documents"
AS PERMISSIVE
FOR DELETE
TO "authenticated"
USING (((select("auth"."jwt"() ->> 'sub'::TEXT)) = "user_id")); -- noqa: CV10

CREATE POLICY "Users can update their own documents"
ON "public"."documents"
AS PERMISSIVE
FOR UPDATE
TO "authenticated"
USING (((select("auth"."jwt"() ->> 'sub'::TEXT)) = "user_id")); -- noqa: CV10

CREATE POLICY "Users must insert their own documents"
ON "public"."documents"
AS PERMISSIVE
FOR INSERT
TO "authenticated"
WITH CHECK (((select("auth"."jwt"() ->> 'sub'::TEXT)) = "user_id")); -- noqa: CV10

CREATE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."documents"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
