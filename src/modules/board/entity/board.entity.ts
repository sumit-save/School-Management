import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    established_year: number;

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