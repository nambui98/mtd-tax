// import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
// import type { Schema, z } from 'zod/v4';
// import type { $ZodShape } from 'zod/v4/core';

// import { FieldValues, Resolver } from 'react-hook-form';

// /**
//  * Creates a resolver for Zod schemas (v4) for React Hook Form.
//  *
//  * Output is inferred from the Zod schema and enforces that the output type is a partial object[1]
//  *
//  * [1] This means that `form.getValues("my_field")` will be typed as `T | undefined` to reflect that the field value may not be set.
//  */
// export function zodResolver<
// Input extends FieldValues, Context, Output
//     // Schema extends z.ZodType<any>,
//     // Output extends FieldValues = z.infer<Schema>,
// >(schema: Schema): Resolver<Input, Context, Input> {
//     return standardSchemaResolver<Partial<Output>, any, Output>(schema);
// }

// /**
//  * Extracts the nested schema of a given key from a Zod schema.
//  *
//  * @example
//  * ```ts
//  * const schema = z.object({
//  *   user: z.object({
//  *     name: z.string(),
//  *     age: z.number(),
//  *   }),
//  * });
//  *
//  * const userSchema = extractSchemaFrom(schema, "user");
//  * // userSchema is now z.object({ name: z.string(), age: z.number() })
//  */
// export function extractSchemaFrom<
//     Schema extends z.ZodObject<any>,
//     Shape extends $ZodShape = Schema extends z.ZodObject<infer U> ? U : never,
//     Key extends keyof Shape = keyof Shape,
// >(schema: Schema, key: Key): Shape[Key] {
//     return schema.def.shape[key];
// }
import { FieldValues, Resolver } from 'react-hook-form';
import { z } from 'zod/v4';
import { z as z3 } from 'zod';
export declare function zodResolver<Input extends FieldValues, Context, Output>(
    schema: z.ZodType<Output, Input>,
    schemaOptions?: Partial<z3.ParseParams>,
    resolverOptions?: {
        mode?: 'async' | 'sync';
        raw?: false;
    },
): Resolver<Input, Context, Output>;
export declare function zodResolver<Input extends FieldValues, Context, Output>(
    schema: z.ZodType<Output, Input>,
    schemaOptions: Partial<z3.ParseParams> | undefined,
    resolverOptions: {
        mode?: 'async' | 'sync';
        raw: true;
    },
): Resolver<Input, Context, Input>;
