import { IMenuRepository } from "repositories/interfaces/IMenuRepository";
import { supabase } from "../../lib/SupabaseClient";

export class SupabaseMenuRepository implements IMenuRepository {

    async getMenuItems(): Promise<any> {
        const { data, error } = await supabase
            .from('MenuItem')
            .select(`
                id,
                name,
                price,
                typeId,
                type:Type(
                    id,
                    name
                )
            `);

        if (error) {
            throw new Error(`Failed to fetch menu items: ${error.message}`);
        }

        return data;
    }
}

export default SupabaseMenuRepository;
