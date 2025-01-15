import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../enum/user-type.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 100 })
    password: string;

    @Column({ length: 100 })
    address: string;

    @Column({ type: "enum", enum: UserType })
    role: UserType;

    @Column({ type: 'tinyint', default: 0 })  // Using TINYINT(1) for is_active
    is_active: number;

    @Column({ nullable: true })
    created_by: string;  // Can be an ID of the user who created the school

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    updated_by: string;  // Can be an ID of the user who updated the school

    @Column({ type: 'timestamp', nullable: true })
    updated_at: Date;

    @Column({ type: 'tinyint', default: 0 })  // Using TINYINT(1) for is_deleted
    is_deleted: number;

    @Column({ nullable: true })
    deleted_by: string;  // Can be an ID of the user who deleted the school

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}