import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SchoolType } from '../enum/school-type.enum';
import { Board } from 'src/modules/board/entity/board.entity';

@Entity()
export class School {
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

    @Column({ type: "enum", enum: SchoolType })
    school_type: SchoolType;

    @ManyToOne(() => Board, board => board.id)
    @JoinColumn({ name: 'board_id' })
    board: Board;

    @Column()
    total_students: number;

    @Column()
    total_teachers: number;

    @Column()
    image: string;

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
